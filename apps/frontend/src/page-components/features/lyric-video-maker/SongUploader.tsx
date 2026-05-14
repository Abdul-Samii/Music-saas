import AudioWave from "./AudioWave";

const SongUploader = () => {
	return (
		<div className="max-w-162.5 mx-auto">
			<input type="file" className="hidden" id="audio" />
			<label
				className="border border-border bg-white shadow-card p-10 rounded-xl cursor-pointer flex flex-col items-center"
				htmlFor="audio"
			>
				<p className="md:text-lg font-semibold">
					Upload your song to generate the lyrics
				</p>
				<div className="my-6">
					<div className="flex items-center justify-center gap-1">
						<AudioWave />
					</div>
				</div>
				<span className="btnShiny rounded-md px-5 md:px-7 h-12 inline-flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
						/>
					</svg>
					Upload your song
				</span>
				<div className="mt-3 text-xs text-muted">
					Max 100MB · <span className="hidden sm:inline">Formats:</span>{" "}
					MP3, WAV, FLAC, AAC, OGG, M4A
				</div>
			</label>
		</div>
	);
};

export default SongUploader;
