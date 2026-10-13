import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const pages = {
  "/Staff": ["Our Team | Haven Heights", "Meet the ministry and support team at Haven Heights Baptist Church in Fort Smith."],
  "/Privacy": [
    "Privacy & Contact Information | Haven Heights",
    "How public submissions, private contact details, account information, and external services are used.",
  ],
  "/": [
    "Haven Heights Baptist Church | Fort Smith",
    "Join Haven Heights Baptist Church in Fort Smith for worship, community, prayer, and Bible teaching.",
  ],
  "/PlanVisit": [
    "Plan Your Visit | Haven Heights",
    "Service times, directions, family ministry information, and a private visitor contact form.",
  ],
  "/About": [
    "About Haven Heights",
    "Meet our Fort Smith church family, learn about membership, and connect with our ministry team.",
  ],
  "/Sermons": [
    "Sermons | Haven Heights",
    "Watch messages from Haven Heights and explore Scripture together.",
  ],
  "/Events": [
    "Church Events | Haven Heights",
    "Upcoming church events, registration, and calendar downloads.",
  ],
  "/CreatePrayerRequest": [
    "Request Prayer | Haven Heights",
    "Share a prayer request and optionally ask a church administrator to pray with you by phone.",
  ],
  "/ViewPrayerRequests": [
    "Prayer Requests | Haven Heights",
    "Pray with our church community.",
  ],
  "/PhotoAlbum": [
    "Church Photos | Haven Heights",
    "Photos of life and community at Haven Heights.",
  ],
  "/SongPicker": [
    "Share a Worship Song | Haven Heights",
    "Find and share a worship song with the Haven Heights church family.",
  ],
};
function meta(name, value, property = false) {
  let element = document.head.querySelector(
    `meta[${property ? "property" : "name"}="${name}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }
  element.content = value;
}
export default function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, description] = pages[pathname] || [
      "Haven Heights Community",
      "Haven Heights Baptist Church community portal.",
    ];
    document.title = title;
    meta("description", description);
    meta("robots", pages[pathname] && pathname !== "/ViewPrayerRequests" ? "index,follow" : "noindex,nofollow");
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:url", window.location.origin + pathname, true);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + pathname;
  }, [pathname]);
  return null;
}
