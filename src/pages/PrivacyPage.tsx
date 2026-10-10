import { Header } from '../components/Header'

export function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header rightLink={{ href: '/', label: '← Back to game' }} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-2 text-2xl font-bold">Privacy</h1>
        <p className="mb-6 text-sm text-slate-600">
          What we collect, what we don't, and why.
        </p>

        <section className="mb-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <p className="text-sm leading-relaxed text-slate-700">
            Vocab Sleuth does not collect personal information from visitors or
            students. We use Cloudflare Web Analytics to anonymously count the 
            number of visits, which helps us understand how Vocab Sleuth is being used in
            classrooms. Cloudflare Web Analytics is cookieless, does not
            fingerprint visitors, and does not track users across other sites.
            see Cloudflare's{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              privacy policy
            </a>{' '}
            for details. We do not share, sell, or otherwise transfer any
            visitor data to third parties. Vocab Sleuth stores your selected
            grade and today's progress in your browser's local storage, and 
            that information never leaves your device.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            Questions or concerns? Email{' '}
            <a
              href="mailto:support@teacher.dev?subject=vocabsleuth%20privacy"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              support@teacher.dev
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
