import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import DailyBibleVerse from './DailyBibleVerse';
import '../style/Home.css';
import Camp from '../images/YouthCamp2025.jpg';
import PrayerPhoto from '../images/YouthPraying.jpg';
import GroupPhoto from '../images/YouthGroup.jpg';
import Camp1 from '../images/YouthCamp2025-1.jpg';
import Camp2 from '../images/YouthCamp2025-2.jpg';
import Camp3 from '../images/YouthCamp2025-3.jpg';
import Camp4 from '../images/YouthCamp2025-4.jpg';
import Camp5 from '../images/YouthCamp2025-5.jpg';
import Camp6 from '../images/YouthCamp2025-6.jpg';
import Camp7 from '../images/YouthCamp2025-7.jpg';
import Camp8 from '../images/YouthCamp2025-8.jpg';
import Camp9 from '../images/YouthCamp2025-9.jpg';
import Camp10 from '../images/YouthCamp2025-10.jpg';
import Camp11 from '../images/YouthCamp2025-11.jpg';
import Camp12 from '../images/YouthCamp2025-12.jpg';
import Camp13 from '../images/YouthCamp2025-13.jpg';

const photos = [Camp, Camp1, Camp2, Camp3, Camp4, Camp5, Camp6, Camp7, Camp8, Camp9, Camp10, Camp11, Camp12, Camp13];

export default function Home() {
  return (
    <div className="hh-home">
      <section className="hh-hero" aria-labelledby="hh-welcome">
        <img className="hh-hero-background" src={PrayerPhoto} alt="Haven Heights church family praying together" fetchPriority="high"/><div className="hh-hero-copy">
          <p className="hh-eyebrow">HAVEN HEIGHTS BAPTIST CHURCH</p>
          <h1 id="hh-welcome">Find your place.<br /><span>Grow in faith.</span></h1>
          <p className="hh-intro">Welcome to Haven Heights. Join us as we grow in faith, serve our community, and experience God’s love together.</p>
          <div className="hh-actions">
            <a className="hh-button hh-primary" href="#service-times">Plan your visit <span aria-hidden="true">↗</span></a>
            <a className="hh-text-link" href="#daily-verse">Today’s scripture <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="hh-shell hh-times" id="service-times" aria-labelledby="hh-times-title">
        <div className="hh-times-heading"><p className="hh-eyebrow">YOU’RE INVITED</p><h2 id="hh-times-title">Join us this week.</h2><p>There’s a place for you and your family.</p></div>
        <div className="hh-schedule"><h3>Sunday</h3><dl><div><dt>Sunday School <small>Classes for all ages</small></dt><dd>9:30 AM</dd></div><div><dt>Morning Service</dt><dd>10:45 AM</dd></div><div><dt>Evening Service</dt><dd>6:30 PM</dd></div></dl></div>
        <div className="hh-schedule"><h3>Wednesday</h3><dl><div><dt>Prayer Meeting</dt><dd>6:30 PM</dd></div></dl><Link className="hh-text-link" to="/Events">View church events <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="hh-connect" aria-labelledby="connect-title"><div className="hh-shell"><p className="hh-eyebrow">LIFE AT HAVEN HEIGHTS</p><h2 id="connect-title">Get connected.</h2><p className="hh-connect-intro">There’s more to church than Sunday. Find your next step.</p><div className="hh-connect-grid"><Link to="/Events" className="hh-connect-card"><img src={GroupPhoto} alt="Our church community together" loading="lazy"/><div><h3>Gather together</h3><span>Explore church events ↗</span></div></Link><Link to="/ViewPrayerRequests" className="hh-connect-card"><img src={PrayerPhoto} alt="Church members praying" loading="lazy"/><div><h3>Pray together</h3><span>Connect through prayer ↗</span></div></Link><Link to="/PhotoAlbum" className="hh-connect-card"><img src={Camp} alt="Youth group at camp" loading="lazy"/><div><h3>Life together</h3><span>See our community ↗</span></div></Link></div></div></section><div className="hh-shell" id="daily-verse"><DailyBibleVerse /></div>

      <section className="hh-shell hh-community" aria-labelledby="hh-community-title">
        <div className="hh-section-heading"><div><p className="hh-eyebrow">LIFE AT HAVEN HEIGHTS</p><h2 id="hh-community-title">Faith. Friendship. Community.</h2></div><Link className="hh-text-link" to="/PhotoAlbum">Explore our photo album <span aria-hidden="true">↗</span></Link></div>
        <Carousel interval={null} className="hh-gallery" aria-label="Youth camp photo gallery">
          {photos.map((photo, index) => <Carousel.Item key={photo}><img src={photo} alt={index === 0 ? 'Youth group at Summit Camps 2025' : `A moment from youth camp 2025, photo ${index + 1}`} loading="lazy" /></Carousel.Item>)}
        </Carousel>
      </section>
      <div className="hh-shell hh-closing"><p>We look forward to worshiping with you.</p><a className="hh-text-link" href="#service-times">See service times ↑</a></div>
    </div>
  );
}
