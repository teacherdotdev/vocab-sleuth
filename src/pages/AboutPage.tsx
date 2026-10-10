import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import edtechathonLogo from '../assets/logo.svg'
import participants from '../assets/2026participants.jpg'

export function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header rightLink={{ href: '/', label: '← Back to game' }} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-2 text-2xl font-bold">About</h1>
        <p className="mb-6 text-sm text-slate-600">
          A classroom-friendly Wordle-style game built for teachers and their students.
        </p>

        <section className="mb-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-3">
            <img
              src={edtechathonLogo}
              alt=""
              className="h-10 w-10 shrink-0"
            />
            <h2 className="text-lg font-semibold">From the EdTech-a-thon</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">
            Vocab Sleuth is a project from the{' '}
            <a
              href="https://edtechathon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              EdTech-a-thon
            </a>
            , a community of builders making free tools for classrooms. Learn
            more about who we are and what else we're building at{' '}
            <a
              href="https://edtechathon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              edtechathon.com
            </a>
            .
          </p>

          <figure className="mx-auto mt-6 w-full max-w-lg -rotate-1 rounded-sm bg-white p-3 pb-6 shadow-lg ring-1 ring-slate-200">
            <img
              src={participants}
              alt="Participants of the 2026 EdTech-a-thon"
              className="w-full bg-slate-100"
            />
            <figcaption className="handwriting pt-5 text-center text-lg text-slate-700">
              EdTech-a-thon 2026
            </figcaption>
          </figure>
        </section>

        <section className="mb-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-2 text-lg font-semibold">Our promise</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              <span className="font-semibold">Zero paywalls.</span>
            </li>
            <li>
              <span className="font-semibold">Zero ads.</span>
            </li>
            <li>
              <span className="font-semibold">Zero tracking of personal data.</span>
            </li>
          </ul>
        </section>

        <section className="mb-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-2 text-lg font-semibold">Feedback & ideas</h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            We'd love to hear from you. Tell us what's working, what's not, or
            pitch us an idea for a tool you wish existed. We're here to help.
          </p>
          <a
            href="mailto:support@teacher.dev?subject=vocabsleuth%20feedback"
            className="inline-block rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-amber-50 ring-1 ring-slate-800 hover:bg-slate-700"
          >
            Email support@teacher.dev
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
