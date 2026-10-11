import type { ReactNode } from 'react'
import edtechathonLogo from '../assets/logo.svg'
import { Link } from './Link'

export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 pb-4 text-center">
      <a
        href="https://edtechathon.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-700"
      >
        <img src={edtechathonLogo} alt="" className="h-6 w-6" />
        Built by the EdTech-a-thon
      </a>
      <Link href="/about" className="text-sm text-slate-500 hover:text-amber-700">
        about
      </Link>
      <Link href="/privacy" className="text-sm text-slate-500 hover:text-amber-700">
        privacy
      </Link>
      {children}
    </footer>
  )
}
