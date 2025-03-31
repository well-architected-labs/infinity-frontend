export class HttpService {
    private static _BASEURL =  "https://api.infinityteam.cloud" 
    static async request<T>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,
        body?: any,
        custom: boolean = false
    ): Promise<T> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json"
            };

            const token = localStorage.getItem("token");

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const options: RequestInit = {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            };

            let buildUrl = new String()

            if (!custom)
                buildUrl = `${this._BASEURL}${url}`;
            else
                buildUrl = `${url}`;

                console.log(buildUrl)

            const response = await fetch(buildUrl.toString(), options);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("tenant_id");
                }

                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (data)
                return data as T;
            else
                return null;
        } catch (err: any) {
            throw new Error(err.message || "Erro desconhecido");
        }
    }

    static get<T>(url: string): Promise<T> {
        return this.request<T>("GET", `${url}`);
    }

    static post<T>(url: string, body: any): Promise<T | undefined> {
        return this.request<T>("POST", `${url}`, body);
    }

    static put<T>(url: string, body: any): Promise<T> {
        return this.request<T>("PUT", `${url}`, body);
    }

    static delete<T>(url: string): Promise<T> {
        return this.request<T>("DELETE", `${url}`);
    }

    static custom<T>(url: string): Promise<T> {
        return this.request<T>("GET", `${url}`, null, true);
    }
}
