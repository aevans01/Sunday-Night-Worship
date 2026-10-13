import { Page, Panel } from "./PortalUI";
import { churchInfo } from "./churchInfo";
export default function Privacy() {
  return (
    <Page
      eyebrow="YOUR INFORMATION"
      title="Care with clarity."
      description="How information is used in this church website."
    >
      <Panel title="Public community content">
        <p>
          Prayer requests, names you choose to display, song submissions, event
          information, sermons, and published photos can be viewed publicly. Do
          not put a phone number or other private information in the public
          prayer description.
        </p>
      </Panel>
      <Panel title="Private contact requests">
        <p>
          If you request prayer by phone or help planning a visit, your contact
          details and message are available to church administrators and are
          included in email notifications sent through Brevo. Your contact
          details do not appear on the public prayer board.
        </p>
        <p>
          The application is configured to remove completed contact records
          after 30 days and other contact records after 90 days. Notification
          records are retained for up to 30 days. Backup copies may remain
          longer under the church’s backup settings.
        </p>
      </Panel>
      <Panel title="Accounts and registrations">
        <p>
          Accounts use a session cookie to keep you signed in. Administrators
          can manage church accounts and view registration contact details.
          Event confirmation and cancellation emails are sent through Brevo.
        </p>
      </Panel>
      <Panel title="External services">
        <p>
          Daily Scripture references and KJV text are requested from Our Manna
          and Bible API. YouTube supplies video thumbnails and hosts videos;
          directions open Google Maps. These services receive ordinary
          connection information when you use them. The site also saves the
          day’s KJV verse in browser storage.
        </p>
      </Panel>
      <Panel title="Questions or a removal request?">
        <p>
          Contact the church office to ask about your information or request
          removal of a public submission or private contact record.
        </p>
        <a href={churchInfo.phoneHref}>{churchInfo.phone}</a>
      </Panel>
    </Page>
  );
}
