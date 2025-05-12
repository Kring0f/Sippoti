const axios = require('axios');

module.exports = async (req, res) => {
    const { songName, Name } = req.query;
    const sName = songName || Name;

    if (!sName) {
        return res.status(400).json({ error: 'Eksik songName sorgu parametresi // Missing songName query parameter' });
    }

    try {
        const searchUrl = `https://spotify-kringof.vercel.app/spotify/search?q=${encodeURIComponent(sName)}&limit=1`;
        const searchResponse = await axios.get(searchUrl);
        const track = searchResponse.data.tracks[0];

        if (!track) {
            return res.status(404).json({ error: 'Sarki Bulunamadi // Song not found' });
        }

        const spotifyUrl = track.spotifyUrl;

        const downloadUrl = `https://spotify-kringof.vercel.app/spotify/down?url=${encodeURIComponent(spotifyUrl)}`;
        const downloadResponse = await axios.get(downloadUrl);

        return res.status(200).json({
            trackName: track.trackName,
            artist: track.artist,
            album: track.album,
            releaseDate: track.releaseDate,
            spotifyUrl: track.spotifyUrl,
            previewUrl: track.previewUrl,
            image: track.image,
            downloadLink: downloadResponse.data.download_link,
            duration: downloadResponse.data.duration
        });

    } catch (error) {
        return res.status(500).json({ error: 'Bir şeyler ters gitti // Something went wrong', details: error.message });
    }
};
