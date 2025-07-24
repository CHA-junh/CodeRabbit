import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../modules/auth/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<ToastProvider>{children}</ToastProvider>
		</AuthProvider>
	</QueryClientProvider>
);

const customRender = (ui: React.ReactElement, options?: any) =>
	render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
