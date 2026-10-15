import { Link } from 'react-router-dom';
import { Page, Panel } from './PortalUI';
import { churchInfo as church } from './churchInfo';
import GroupPhoto from '../images/YouthGroup.jpg';
import PrayerPhoto from '../images/YouthPraying.jpg';
import '../style/Welcome.css';
export default function About() {
  return <Page eyebrow="WELCOME TO HAVEN HEIGHTS" title="A church family. A place for you." description="Whether you’re visiting for the first time or looking for a church home, we’d love to get to know you." action={<Link className="portal-btn" to="/PlanVisit">Plan your visit ↗</Link>}>
    <section className="welcome-story"><img src={GroupPhoto} alt="Haven Heights youth sharing time together" /><div><p className="portal-eyebrow">FAITH & FRIENDSHIP</p><h2>You’re welcome here.</h2><p>At Haven Heights, we gather to worship, learn from Scripture, and encourage one another through everyday life. We want to be available to you—whether you join us for one visit or become part of our church family.</p><p>Come with your questions, bring your family, and take a first step at your own pace. We look forward to meeting you.</p><Link className="portal-btn" to="/PlanVisit">What to expect ↗</Link></div></section>
    <section className="welcome-section"><p className="portal-eyebrow">GROW WITH US</p><h2>Life together at Haven Heights.</h2><div className="portal-admin-grid"><Panel title="Worship & Scripture"><p>Our Sunday and Wednesday gatherings bring together worship, Bible teaching, and encouragement for members and guests.</p><Link to="/Sermons">Explore messages →</Link></Panel><Panel title="Every generation"><p>From preschoolers to senior adults, Bible study and ministry opportunities help people build friendships and grow in faith. Our youth connect through study, fellowship, retreats, and camp.</p><Link to="/Events">Find a gathering →</Link></Panel><Panel title="Care & prayer"><p>You don’t have to face life’s difficult moments alone. Share a prayer request, or ask a church administrator to contact you and pray with you.</p><Link to="/CreatePrayerRequest">Request prayer →</Link></Panel></div></section>
    <section className="welcome-story welcome-story-reverse"><img src={PrayerPhoto} alt="Haven Heights church family praying together" loading="lazy" /><div><p className="portal-eyebrow">HERE FOR ONE ANOTHER</p><h2>Faith that reaches beyond Sunday.</h2><p>Through prayer, pastoral care, and support for missions, we seek to share the hope of Jesus Christ with our neighbors and communities around the world.</p><p>Our ministry and support team would love to help you find your next step.</p><Link className="portal-btn" to="/Staff">Meet our team ↗</Link></div></section>
    <Panel className="welcome-membership" title="Thinking about becoming a member?">
      <p className="portal-eyebrow">BECOME PART OF OUR CHURCH FAMILY</p>
      <p>At the close of each worship service, we invite those who would like to become members of Haven Heights Baptist Church to come forward. When the pastor offers the invitation, you’re welcome to come to the front of the church to ask questions or discuss joining in one of the following ways.</p>
      <dl className="welcome-membership-options">
        <div><dt>Profession of Faith &amp; Baptism</dt><dd>Place your faith and trust in Jesus Christ alone as your personal Savior, and follow Him in baptism by immersion as a testimony of your salvation and obedience to His command.</dd></div>
        <div><dt>Transfer of Letter</dt><dd>If you are currently a member of another Southern Baptist church, you may join by transferring your membership letter.</dd></div>
        <div><dt>Baptism When Coming from Another Denomination</dt><dd>If you are coming from another denomination, speak with the pastor about joining through baptism.</dd></div>
        <div><dt>Statement of Faith</dt><dd>If you have received Jesus Christ as your personal Savior and have been scripturally baptized, you may join by a statement of faith.</dd></div>
      </dl>
      <div className="welcome-membership-footer"><p>Have questions? We’d love to talk with you about faith, baptism, or becoming part of our church family.</p><a className="portal-btn" href={church.phoneHref}>Call the church office ↗</a></div>
    </Panel>
    <section className="welcome-connect"><div><p className="portal-eyebrow">YOUR NEXT STEP</p><h2>Come spend a Sunday with us.</h2><p>{church.address}</p><a href={church.phoneHref}>{church.phone}</a></div><Link className="portal-btn" to="/PlanVisit">Plan your visit ↗</Link></section>
  </Page>;
}
