import BackButton from '../components/BackButton';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <BackButton className="mb-8" />
      <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">Terms and Conditions</h1>
      <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400 mb-8 italic">Last Updated: February 27, 2026</p>
        
        <p>Welcome to CG Khabri Network!</p>

        <p>
          These terms and conditions outline the rules and regulations for the use of CG Khabri Network's Website, located at cgkhabri.network.
        </p>

        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use CG Khabri Network if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Cookies</h2>
        <p>
          We employ the use of cookies. By accessing CG Khabri Network, you agreed to use cookies in agreement with the CG Khabri Network's Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">License</h2>
        <p>
          Unless otherwise stated, CG Khabri Network and/or its licensors own the intellectual property rights for all material on CG Khabri Network. All intellectual property rights are reserved. You may access this from CG Khabri Network for your own personal use subjected to restrictions set in these terms and conditions.
        </p>

        <p>You must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Republish material from CG Khabri Network</li>
          <li>Sell, rent or sub-license material from CG Khabri Network</li>
          <li>Reproduce, duplicate or copy material from CG Khabri Network</li>
          <li>Redistribute content from CG Khabri Network</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Hyperlinking to our Content</h2>
        <p>
          The following organizations may link to our Website without prior written approval:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Government agencies;</li>
          <li>Search engines;</li>
          <li>News organizations;</li>
          <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Content Liability</h2>
        <p>
          We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libellous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Reservation of Rights</h2>
        <p>
          We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </p>
      </div>
    </div>
  );
}
