/**
 * Lobby Sign data feed for Bridgetown Church.
 *
 * Hands the lobby TV today's Planning Center Calendar events tagged "Lobby Sign":
 * event name, public start and end time (never setup or teardown), and rooms.
 * The Planning Center token lives only here, in this project's Script Properties.
 *
 * Setup, in order:
 *   1. Paste your Planning Center Application ID and Secret into saveToken, run it once,
 *      then put the PASTE_ placeholders back and save.
 *   2. Run checkSetup and read the Execution log.
 *   3. Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 */

var TAG_NAME = 'Lobby Sign';
var TIME_ZONE = 'America/Los_Angeles';
var API = 'https://api.planningcenteronline.com/calendar/v2';
var FEED_CACHE_SECONDS = 60;      // how long one answer is reused before asking Planning Center again
var LOOKUP_CACHE_SECONDS = 21600; // tag and room lists are re-read every 6 hours

/** Step 1. Run once with your real values, then put the placeholders back. */
function saveToken() {
  var applicationId = 'PASTE_APPLICATION_ID_HERE';
  var secret = 'PASTE_SECRET_HERE';
  if (applicationId.indexOf('PASTE_') === 0 || secret.indexOf('PASTE_') === 0) {
    throw new Error('Paste your Application ID and Secret into saveToken first, then run it again.');
  }
  PropertiesService.getScriptProperties()
    .setProperty('PCO_AUTH', Utilities.base64Encode(applicationId + ':' + secret));
  CacheService.getScriptCache().removeAll(['feed', 'tagId', 'rooms']);
  Logger.log('Saved. Now change the two values back to PASTE_APPLICATION_ID_HERE and PASTE_SECRET_HERE, and save the script.');
}

/** Step 2. Checks the token, the tag, the rooms, and today's tagged events. */
function checkSetup() {
  CacheService.getScriptCache().removeAll(['feed', 'tagId', 'rooms']);
  var saved = !!PropertiesService.getScriptProperties().getProperty('PCO_AUTH');
  Logger.log('Planning Center token saved: ' + (saved ? 'yes' : 'NO. Run saveToken first.'));
  if (!saved) return;

  var tagId = findTagId_();
  Logger.log('Tag "' + TAG_NAME + '": ' + (tagId ? 'found' : 'NOT FOUND. Check the spelling of the tag in Planning Center.'));

  var rooms = getRooms_();
  var names = Object.keys(rooms).map(function (id) { return rooms[id]; }).sort();
  Logger.log('Rooms in Planning Center (' + names.length + '): ' + names.join(', '));

  var feed = buildFeed_();
  Logger.log('Tagged events left today: ' + feed.events.length);
  feed.events.forEach(function (e) {
    Logger.log('  ' + e.name + ' | ' + Utilities.formatDate(new Date(e.start), TIME_ZONE, 'h:mm a') +
      ' to ' + Utilities.formatDate(new Date(e.end), TIME_ZONE, 'h:mm a') + ' | ' + (e.rooms.join(' & ') || 'no room'));
  });
}

/** The web app the TV reads. */
function doGet() {
  var cache = CacheService.getScriptCache();
  var json = cache.get('feed');
  if (!json) {
    try {
      json = JSON.stringify(buildFeed_());
      cache.put('feed', json, FEED_CACHE_SECONDS);
    } catch (err) {
      // The TV keeps showing its last good update when it gets an error.
      json = JSON.stringify({ error: String(err && err.message || err), events: null });
    }
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function buildFeed_() {
  var now = new Date();
  var tagId = findTagId_();
  if (!tagId) return { updated: now.toISOString(), events: [] };

  // Instances that started by the end of today (Portland time) and haven't ended yet.
  var today = Utilities.formatDate(now, TIME_ZONE, 'yyyy-MM-dd');
  var res = pcoAll_('/event_instances', {
    'where[starts_at][lte]': today,
    'where[ends_at][gte]': now.toISOString(),
    'include': 'tags,resource_bookings',
    'order': 'starts_at',
    'per_page': 100
  });

  var instances = res.data;
  var tagged = filterTagged_(instances, tagId);
  var rooms = getRooms_();

  // Room bookings, grouped by event instance.
  var bookingsByInstance = {};
  res.included.forEach(function (inc) {
    if (inc.type !== 'ResourceBooking') return;
    var rel = inc.relationships || {};
    var instId = rel.event_instance && rel.event_instance.data && rel.event_instance.data.id;
    var resId = rel.resource && rel.resource.data && rel.resource.data.id;
    if (!instId || !resId || !rooms[resId]) return;
    (bookingsByInstance[instId] = bookingsByInstance[instId] || []).push(rooms[resId]);
  });

  var events = [];
  tagged.forEach(function (inst) {
    var a = inst.attributes || {};
    // Public times only. Planning Center keeps setup and teardown separate from these.
    var start = validDate_(a.published_starts_at) || validDate_(a.starts_at);
    var end = validDate_(a.published_ends_at) || validDate_(a.ends_at);
    if (!start || !end || end <= now) return;
    var roomNames = [];
    (bookingsByInstance[inst.id] || []).forEach(function (n) { if (roomNames.indexOf(n) === -1) roomNames.push(n); });
    events.push({ name: a.name, start: start.toISOString(), end: end.toISOString(), rooms: roomNames });
  });

  events.sort(function (x, y) { return x.start < y.start ? -1 : x.start > y.start ? 1 : x.name.localeCompare(y.name); });
  return { updated: now.toISOString(), events: events };
}

/** Keeps only instances carrying the Lobby Sign tag. */
function filterTagged_(instances, tagId) {
  var haveLinks = instances.some(function (inst) { return inst.relationships && inst.relationships.tags; });
  return instances.filter(function (inst) {
    var ids;
    if (haveLinks) {
      ids = ((inst.relationships.tags || {}).data || []).map(function (t) { return t.id; });
    } else {
      ids = pcoAll_('/event_instances/' + inst.id + '/tags', { per_page: 100 }).data.map(function (t) { return t.id; });
    }
    return ids.indexOf(String(tagId)) !== -1;
  });
}

function findTagId_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('tagId');
  if (cached) return cached;
  var tags = pcoAll_('/tags', { per_page: 100 }).data;
  var match = tags.filter(function (t) {
    return String((t.attributes || {}).name || '').trim().toLowerCase() === TAG_NAME.toLowerCase();
  })[0];
  if (match) cache.put('tagId', String(match.id), LOOKUP_CACHE_SECONDS);
  return match ? String(match.id) : null;
}

/** Every room in Planning Center, as { id: name }. */
function getRooms_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('rooms');
  if (cached) return JSON.parse(cached);
  var rooms = {};
  pcoAll_('/resources', { per_page: 100 }).data.forEach(function (r) {
    var a = r.attributes || {};
    if (String(a.kind || '').toLowerCase() === 'room') rooms[r.id] = a.name;
  });
  cache.put('rooms', JSON.stringify(rooms), LOOKUP_CACHE_SECONDS);
  return rooms;
}

/** GET every page of a Planning Center list. */
function pcoAll_(path, params) {
  var out = { data: [], included: [] };
  var url = buildUrl_(API + path, params);
  for (var guard = 0; url && guard < 20; guard++) {
    var body = pco_(url);
    out.data = out.data.concat(body.data || []);
    out.included = out.included.concat(body.included || []);
    url = body.links && body.links.next ? body.links.next : null;
  }
  return out;
}

function pco_(url) {
  var auth = PropertiesService.getScriptProperties().getProperty('PCO_AUTH');
  if (!auth) throw new Error('No Planning Center token saved. Run saveToken first.');
  var res = UrlFetchApp.fetch(url, {
    headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': 'Bridgetown Church Lobby Sign (bridgetown.church)' },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('Planning Center answered ' + code + ' for ' + url.replace(API, '') + ': ' + res.getContentText().slice(0, 300));
  }
  return JSON.parse(res.getContentText());
}

function buildUrl_(base, params) {
  if (!params) return base;
  var q = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');
  return base + (base.indexOf('?') === -1 ? '?' : '&') + q;
}

function validDate_(value) {
  if (!value) return null;
  var d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
