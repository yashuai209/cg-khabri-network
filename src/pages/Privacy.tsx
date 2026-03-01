import BackButton from '../components/BackButton';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <BackButton className="mb-8" />
      <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400 mb-8 italic">Last Updated: February 26, 2026</p>
        
        <p>
          At CG Khabri Network, accessible from cgkhabri.network, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CG Khabri Network and how we use it.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Log Files</h2>
        <p>
          CG Khabri Network follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Cookies and Web Beacons</h2>
        <p>
          Like any other website, CG Khabri Network uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-red-600 hover:underline">https://policies.google.com/technologies/ads</a>
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Advertising Partners</h2>
        <p>
          Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Google: <a href="https://policies.google.com/technologies/ads" className="text-red-600 hover:underline">https://policies.google.com/technologies/ads</a>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Advertising Partners Privacy Policies</h2>
        <p>
          You may consult this list to find the Privacy Policy for each of the advertising partners of CG Khabri Network.
        </p>
        <p>
          Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on CG Khabri Network, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>
        <p>
          Note that CG Khabri Network has no access to or control over these cookies that are used by third-party advertisers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Third Party Privacy Policies</h2>
        <p>
          CG Khabri Network's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}
