import { NextRequest, NextResponse } from 'next/server';

const API = process.env.BACKEND_INTERNAL_URL ?? 'https://api.escalium.io/api/v1';

function escHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface LandingPage {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  spotifyUrl: string | null;
  pixelId: string | null;
}

function buildHtml(page: LandingPage): string {
  const pixel = page.pixelId
    ? `<script>window.addEventListener('load',function(){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${escHtml(page.pixelId)}');fbq('track','PageView');fbq('track','ViewContent');});</script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${escHtml(page.pixelId)}&ev=PageView&noscript=1" alt=""></noscript>`
    : '';

  const spotifyBtn = page.spotifyUrl
    ? `<a class="btn-spotify" href="${escHtml(page.spotifyUrl)}" target="_blank" rel="noopener noreferrer">
        <div class="spotify-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        </div>
        <div class="btn-text">
          <span class="btn-title">Stream on Spotify</span>
          <span class="btn-sub">Click (+) on Spotify to Save it</span>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#000000">
<title>${escHtml(page.title)}</title>
<meta property="og:title" content="${escHtml(page.title)}">
<meta property="og:image" content="${escHtml(page.thumbnailUrl)}">
<meta property="og:type" content="music.song">
<link rel="icon" href="${escHtml(page.thumbnailUrl)}" type="image/jpeg">
<link rel="apple-touch-icon" href="${escHtml(page.thumbnailUrl)}">
<link rel="preconnect" href="https://api.escalium.io">
<link rel="preload" as="image" href="${escHtml(page.thumbnailUrl)}" fetchpriority="high">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}
body{
  display:flex;align-items:center;justify-content:center;
  background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  position:relative;min-height:100vh;overflow:hidden;
}
.bg{
  position:fixed;inset:0;width:100%;height:100%;
  object-fit:cover;
  filter:blur(48px) brightness(0.38) saturate(1.3);
  transform:scale(1.15);z-index:0;
}
.wrap{
  position:relative;z-index:1;
  display:flex;flex-direction:column;align-items:center;
  gap:1.375rem;padding:2rem 1.25rem;
  max-width:400px;width:100%;
}
.art{
  width:272px;height:272px;object-fit:cover;
  border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,0.6);
  display:block;
}
.title{
  color:#fff;font-size:1.875rem;font-weight:800;
  text-align:center;line-height:1.18;
  letter-spacing:-0.025em;text-shadow:0 2px 12px rgba(0,0,0,0.5);
}
.desc{
  color:rgba(255,255,255,0.65);font-size:0.875rem;
  text-align:center;line-height:1.5;margin-top:-0.25rem;
}
.btn-spotify{
  display:flex;align-items:center;gap:0.625rem;
  background:#1DB954;border-radius:10px;
  padding:0.4rem 0.75rem;text-decoration:none;
  width:100%;max-width:340px;
  transition:transform 0.15s ease,opacity 0.15s ease;
}
.btn-spotify:hover{transform:scale(1.025);opacity:.95}
.btn-spotify:active{transform:scale(0.97)}
.spotify-icon{
  width:32px;height:32px;border-radius:50%;
  background:rgba(255,255,255,0.18);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.btn-text{flex:1}
.btn-title{color:#fff;font-size:0.82rem;font-weight:700;display:block}
.btn-sub{color:rgba(255,255,255,0.72);font-size:0.65rem;display:block;margin-top:1px}
.footer{position:fixed;bottom:1.25rem;left:0;right:0;text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.35);letter-spacing:0.03em;text-decoration:none;z-index:2}
.footer:hover{color:rgba(255,255,255,0.6)}
@media(max-width:440px){
  .art{width:220px;height:220px}
  .title{font-size:1.5rem}
}
</style>
</head>
<body>
<div class="wrap">
  <img class="art" src="${escHtml(page.thumbnailUrl)}" alt="${escHtml(page.title)}" width="272" height="272" fetchpriority="high">
  <h1 class="title">${escHtml(page.title)}</h1>
  ${page.description ? `<p class="desc">${escHtml(page.description)}</p>` : ''}
  ${spotifyBtn}
</div>
<a href="https://escalium.io" target="_blank" rel="noopener noreferrer" class="footer">POWERED BY ESCALIUM</a>
<img class="bg" src="${escHtml(page.thumbnailUrl)}" alt="" aria-hidden="true" fetchpriority="low">
${pixel}
</body>
</html>`;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ artist: string; song: string }> },
) {
  const { artist, song } = await context.params;

  let page: LandingPage | null = null;
  try {
    const res = await fetch(`${API}/landing-pages/${artist}/${song}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) page = (await res.json()) as LandingPage;
  } catch {
    // fall through to 404
  }

  if (!page) {
    return new NextResponse(
      '<!DOCTYPE html><html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:#fff"><p>Page not found</p></body></html>',
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  return new NextResponse(buildHtml(page), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
