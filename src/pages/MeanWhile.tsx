import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MeanWhile() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6">
			<div className="w-full max-w-2xl rounded-2xl border border-border/20 bg-white shadow-lg p-12 text-center">
				<h1 className="text-2xl sm:text-3xl font-extralight mb-4 text-foreground">
					Coming real soon on App Store and Play Store
				</h1>

				<p className="text-muted-foreground mb-8">
					Early access to the app available for paying users or glass owners.
				</p>

				<p className="text-muted-foreground mb-8">
					You are one of them?{" "}
					<button
						onClick={() => navigate("/subscribe")}
						className="text-blue-600 underline hover:text-blue-700 transition"
					>
						Click here
					</button>{" "}
					to download Tricher.
				</p>

				<div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
					<div className="flex items-center">
						<Button
							variant="default"
							size="lg"
							className="rounded-lg shadow-sm"
							onClick={() =>
								navigate("/checkout", {
									state: { productId: "tricher", amount: 4499 },
								})
							}
						>
							Get Glasses
						</Button>
					</div>

					<Button
						variant="outline"
						size="lg"
						className="rounded-lg"
						onClick={() => navigate("/subscribe")}
					>
						Renew AI
					</Button>
				</div>

				<div className="mt-4">
					<button
						onClick={() => window.open("https://tricher.in", "_blank")}
						className="text-sm text-muted-foreground"
					>
						Visit tricher.in
					</button>
				</div>
			</div>
		</div>
	);
}
