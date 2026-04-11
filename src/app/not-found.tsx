/* eslint-disable @next/next/no-html-link-for-pages */
export default function NotFound() {
    return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <a href='/'>Вернуться на главную</a>
        </div>
    );
}
