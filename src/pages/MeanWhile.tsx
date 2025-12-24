import React, { useState } from "react";

export default function MeanWhile() {
	const [notified, setNotified] = useState(false);

	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
			<div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-black/60 via-white/2 to-black/40 p-10 shadow-2xl">
				<div className="flex flex-col md:flex-row items-center gap-8">
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
							Downloads for Android
						</h1>
						

						<div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start">
							<button
								disabled
								className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-5 py-3 text-sm font-medium text-white/90 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										d="M12 2v12"
										strokeWidth={1.5}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M8 10l4 4 4-4"
										strokeWidth={1.5}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Download (Android)
							</button>

							<button
								onClick={() => setNotified(true)}
								className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-3 text-sm font-semibold"
							>
								{notified ? "You're on the list" : "Notify me"}
							</button>
						</div>

						<div className="mt-6 text-xs text-white/60">
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-white animate-pulse" />
								Available soon — stay tuned.
							</span>
						</div>
					</div>

					
				</div>
			</div>
		</div>
	);
}
