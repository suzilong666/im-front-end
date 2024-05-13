export function isAbsolutePath(path) {
	// 使用 URL 对象来判断路径是否为绝对路径
	try {
		new URL(path);
		return true;
	} catch (error) {
		return false;
	}
}

export function joinUrls(baseUrl = '', pathUrl = '') {
	// 移除基础 URL 结尾的斜杠和路径 URL 开头的斜杠
	const cleanedBaseUrl = baseUrl.replace(/\/$/, '');
	const cleanedPathUrl = pathUrl.replace(/^\//, '');

	// 使用拼接符号将基础 URL 和路径 URL 进行拼接
	return cleanedBaseUrl + '/' + cleanedPathUrl;
}