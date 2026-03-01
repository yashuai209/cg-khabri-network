import BackButton from '../components/BackButton';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <BackButton className="mb-8" />
      <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">Disclaimer</h1>
      <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
        <p className="text-sm text-gray-400 mb-8 italic">Last Updated: February 27, 2026</p>
        
        <p>
          If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at yashwantkhutte4@gmail.com.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Disclaimers for CG Khabri Network</h2>
        <p>
          All the information on this website - cgkhabri.network - is published in good faith and for general information purpose only. CG Khabri Network does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (CG Khabri Network), is strictly at your own risk. CG Khabri Network will not be liable for any losses and/or damages in connection with the use of our website.
        </p>

        <p>
          From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
        </p>

        <p>
          Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Consent</h2>
        <p>
          By using our website, you hereby consent to our disclaimer and agree to its terms.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Update</h2>
        <p>
          Should we update, amend or make any changes to this document, those changes will be prominently posted here.
        </p>
      </div>
    </div>
  );
}
