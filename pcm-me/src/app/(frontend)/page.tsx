/**
 * Placeholder root page (Session 01). The public site shell, locale routing
 * and templates are built in Session 03; this only confirms the app boots.
 */
export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 640 }}>
      <h1>pcm.me</h1>
      <p>Foundation is up. The public site is built in Session 03.</p>
      <p>
        Admin: <a href="/admin">/admin</a>
      </p>
    </main>
  )
}
