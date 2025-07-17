import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const backendResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/sys/menus`,
			{
				method: "GET",
				headers: request.headers,
			}
		);

		if (!backendResponse.ok) {
			const errorText = await backendResponse.text();
			console.error(
				`Error from backend: ${backendResponse.status} ${backendResponse.statusText}`,
				errorText
			);
			return NextResponse.json(
				{ error: "Failed to fetch menus from backend" },
				{ status: backendResponse.status }
			);
		}

		const data = await backendResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in menus GET handler:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
