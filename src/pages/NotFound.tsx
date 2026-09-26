import AppLink from '../components/AppLink'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-heading text-5xl sm:text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-heading text-xl sm:text-2xl font-semibold text-gray-900">
          This page does not exist
        </h1>
        <p className="mt-2 text-gray-600 leading-relaxed">
          The address you opened does not match any page on this site.
        </p>
        <AppLink
          to="/"
          className="mt-6 inline-flex items-center justify-center min-h-[48px] px-6 bg-primary hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Back to portfolio
        </AppLink>
      </div>
    </div>
  )
}
