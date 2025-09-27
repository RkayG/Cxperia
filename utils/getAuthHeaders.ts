export function getAuthHeaders() {
	function getCookie(name: string) {
		if (typeof document === 'undefined') return null;
		const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	}
	const token = getCookie('token') || localStorage.getItem('token');
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}