'use strict';
const fs=require('node:fs'),path=require('node:path');
const origin=new URL(process.env.SITE_URL||process.env.URL||'https://hhbc-sunday-night-worship.netlify.app').origin;
const routes=['/','/PlanVisit','/About','/Privacy','/Sermons','/Events','/CreatePrayerRequest','/PhotoAlbum','/SongPicker'];
const escaped=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const build=path.join(process.cwd(),'build');fs.mkdirSync(build,{recursive:true});
fs.writeFileSync(path.join(build,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>`<url><loc>${escaped(origin+r)}</loc></url>`).join('')+'</urlset>');
fs.writeFileSync(path.join(build,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /ViewPrayerRequests\nDisallow: /Admin\nDisallow: /Manage\nDisallow: /Notifications\nDisallow: /PrayerFollowups\nDisallow: /VisitorRequests\nDisallow: /ViewUsersAdmin\nDisallow: /ViewEventsAdmin\nDisallow: /ViewSongsAdmin\nDisallow: /ViewPRAdmin\nDisallow: /Login\nDisallow: /Register\nDisallow: /ViewProfile\nDisallow: /EditProfile\nDisallow: /UploadPhotos\nDisallow: /CreateEvent\nDisallow: /EditEvent\nDisallow: /SongSelector\nSitemap: ${origin}/sitemap.xml\n`);
console.log('Sitemap and robots.txt generated for the primary site URL.');
