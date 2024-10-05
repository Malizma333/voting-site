export class PlaylistLoader {
  static async initPlaylist () {
    const ytStorageKey = 'YOUTUBE_NOMINATION_PLAYLIST'

    let youtubePlaylist = JSON.parse(window.localStorage.getItem(ytStorageKey))

    if (youtubePlaylist === null) {
      const req = await fetch('/api/youtube_data')
      youtubePlaylist = await req.json()

      if (req.status !== 200) {
        console.error('[Youtube API]', req.statusText)
        return null
      }

      if (youtubePlaylist.includes('Error')) {
        console.error('[Youtube API]', youtubePlaylist)
        return null
      }

      window.localStorage.setItem(ytStorageKey, JSON.stringify(youtubePlaylist))
    }

    return youtubePlaylist
  }
}
