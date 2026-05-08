'use client';

import './user-agreement.css';

export default function UserAgreementPage() {
    return (
        <div className='user-agreement'>
            <h1 className='user-agreement__title'>
                Пользовательское соглашение сервиса ZaneShop
            </h1>

            <p className='user-agreement__subtitle'>
                Используя сервис, я подтверждаю, что ознакомлен, согласен и
                принимаю условия настоящего соглашения
            </p>

            {/* Вводный абзац */}
            <div className='user-agreement__section'>
                <p className='user-agreement__paragraph'>
                    Настоящее Пользовательское соглашение (далее — Соглашение)
                    определяет условия использования Сервиса и является
                    публичной офертой Агента.
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>Агент</strong> —
                    Индивидуальный предприниматель Рустамов Ибрагим Эльнурович,
                    ИНН 500316223494, ОГРНИП 326508100270908, зарегистрирован
                    Межрайонной ИФНС России №23 по Московской области 30 апреля
                    2026 г.
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>Сервис</strong> — сайт,
                    размещённый по адресу: https://zaneshop.ru (включая
                    поддомены).
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>Принципал</strong> — любое
                    дееспособное физическое лицо, совершившее акцепт Соглашения.
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>Игра</strong> — сервисы
                    третьих лиц, предоставляющие Принципалу доступ к
                    компьютерным играм и иным цифровым товарам и услугам.
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>
                        Политика конфиденциальности
                    </strong>{' '}
                    — документ, определяющий порядок обработки персональных
                    данных, размещённый по адресу: https://zaneshop.ru/privacy.
                </p>
                <p className='user-agreement__paragraph'>
                    <strong style={{ color: '#fff' }}>Стороны</strong> — Агент и
                    Принципал совместно.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    1. Предмет соглашения
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>1.1.</span> Агент
                    обязуется от имени и за счёт Принципала за вознаграждение
                    совершать действия, направленные на перевод денежных средств
                    правообладателям Игр, представленных в Сервисе.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>1.2.</span> Конкретный
                    перечень и содержание действий Агента определяются
                    функционалом Сервиса и считаются согласованными Сторонами с
                    момента их совершения посредством Сервиса.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    2. Принятие условий соглашения
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>2.1.</span>{' '}
                    Безоговорочным принятием (акцептом) условий Соглашения
                    признаётся внесение Принципалом данных, необходимых для
                    перевода средств правообладателю Игры, и нажатие кнопки
                    «Перейти к оплате», либо совершение оплаты через платёжную
                    систему ЮКасса с использованием СБП или иных поддерживаемых
                    способов.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>2.2.</span> Если
                    Принципал не согласен с каким-либо условием Соглашения, он
                    обязан незамедлительно прекратить использование Сервиса.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    3. Условия использования сервиса
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.1.</span> Агент
                    осуществляет предусмотренные Соглашением действия
                    исключительно по поручениям Принципала, направленным с
                    помощью функционала Сервиса.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.2.</span> Поручение
                    считается направленным, если Принципал заполнил форму и
                    нажал «Перейти к оплате», а Агент получил подтверждение
                    успешного проведения платежа.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.3.</span> Агент
                    выполняет поручение в течение пяти рабочих дней с момента
                    его направления. Поручение считается исполненным в момент
                    зачисления средств на счёт правообладателя Игры.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.4.</span> В
                    некоторых случаях Принципал обязан предоставить данные
                    учётной записи в Игре либо самостоятельно авторизоваться в
                    ней. Принципал даёт согласие на передачу Агенту логина,
                    пароля и иных необходимых данных исключительно в целях
                    правомерного выполнения поручения.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.5.</span> Агент
                    вправе без согласия Принципала привлекать третьих лиц и
                    субагентов для исполнения обязательств по Соглашению.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.6.</span> Принципал,
                    совершая покупку, подтверждает, что является
                    совершеннолетним и имеет право на совершение транзакции.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>3.7.</span> Агент
                    вправе отказаться от выполнения поручения при нарушении
                    Принципалом условий Соглашения или наличии иных существенных
                    оснований. Возврат средств производится согласно политике
                    возвратов: https://zaneshop.ru/refund.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    4. Финансовые условия
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>4.1.</span> Оплата
                    осуществляется Принципалом предварительно через интерфейс
                    Сервиса с использованием платёжной системы ЮКасса, включая
                    Систему быстрых платежей (СБП) и иные поддерживаемые
                    способы.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>4.2.</span> Стоимость
                    услуг Агента указана на страницах Сервиса и включает все
                    расходы на исполнение поручения. Банки, платёжные системы и
                    операторы связи вправе дополнительно взимать собственные
                    комиссии — такие комиссии не входят в стоимость услуг Агента
                    и оплачиваются Принципалом самостоятельно.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>4.3.</span>
                    Минимальная сумма заказа — 40 рублей. Все расчёты между
                    Сторонами ведутся в российских рублях.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>4.4.</span> Агент не
                    несёт ответственности за убытки, возникшие вследствие
                    курсовых разниц при конвертации валют платёжными системами
                    при переводе средств правообладателям иностранных Игр.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>4.5.</span> Агент не
                    несёт ответственности за неверно указанные Принципалом
                    данные профиля и не возвращает средства в случае их
                    некорректного указания. Перечисление средств осуществляется
                    строго по данным, указанным Принципалом в форме заказа.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    5. Отчёт агента
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>5.1.</span> Агент
                    предоставляет Принципалу отчёт в течение 5 рабочих дней с
                    момента исполнения поручения в разделе «Профиль / Покупки».
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>5.2.</span> Отчёт
                    считается принятым, а поручение — надлежащим образом
                    исполненным, если в течение трёх рабочих дней Принципал не
                    направил письменных мотивированных возражений.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    6. Запрещённые действия
                </h2>
                <p className='user-agreement__paragraph'>
                    Принципалу запрещено:
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.1.</span>{' '}
                    использовать Сервис способами, не предусмотренными
                    Соглашением;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.2.</span>{' '}
                    предпринимать действия, направленные на нарушение
                    нормального функционирования Сервиса, в том числе
                    технического характера;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.3.</span>{' '}
                    использовать автоматизированные средства для сбора,
                    обработки или систематизации информации Сервиса;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.4.</span> обходить
                    установленные технические ограничения Сервиса;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.5.</span> вводить
                    пользователей или Агента в заблуждение, в том числе выдавать
                    себя за другое лицо;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.6.</span> без
                    разрешения использовать логотипы и товарные знаки Агента;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.7.</span>{' '}
                    использовать Сервис для проведения незаконных платежей,
                    мошеннических и иных неправомерных действий;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>6.8.</span> совершать
                    покупку со счёта другого лица без его ведома и согласия.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>7. Блокировка</h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>7.1.</span> При
                    совершении Принципалом запрещённых действий или нарушении
                    иных условий Соглашения Агент вправе заблокировать учётную
                    запись Принципала. Блокировка означает полный или частичный
                    отказ от Соглашения в одностороннем порядке, временное или
                    постоянное ограничение доступа к Сервису, а также
                    аннулирование средств на балансе аккаунта без права их
                    возврата.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    8. Ответственность сторон
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>8.1.</span> За
                    неисполнение или ненадлежащее исполнение обязательств
                    Стороны несут ответственность в соответствии с
                    законодательством Российской Федерации.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>8.2.</span> Агент
                    несёт ответственность за хранение и обработку персональных
                    данных Принципала и обеспечивает их конфиденциальность.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>8.3.</span> Агент
                    гарантирует предоставление Принципалу полной и достоверной
                    информации посредством её размещения на Сервисе.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    9. Ограничение ответственности
                </h2>
                <p className='user-agreement__paragraph'>
                    Агент не несёт ответственности за:
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>9.1.</span> действия
                    или бездействие платёжных систем, банков, правообладателей
                    Игр и иных третьих лиц;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>9.2.</span> убытки,
                    возникшие в результате использования или невозможности
                    использования Сервиса;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>9.3.</span>{' '}
                    технические сбои, DDoS-атаки, проблемы хостинга и иные
                    обстоятельства, не зависящие от Агента;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>9.4.</span>{' '}
                    последствия предоставления Принципалом доступа к своей
                    учётной записи третьим лицам;
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>9.5.</span> поломки
                    устройств Принципала, возникшие при использовании Сервиса.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    10. Форс-мажор
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>10.1.</span> Стороны
                    освобождаются от ответственности за ненадлежащее исполнение
                    Соглашения, если это вызвано обстоятельствами непреодолимой
                    силы (пожар, наводнение, землетрясение, эпидемия,
                    забастовка, действия государственных органов и иные
                    обстоятельства, не зависящие от воли Сторон).
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>10.2.</span> Сторона,
                    которая не может выполнить обязательства, обязана письменно
                    уведомить другую Сторону в течение 10 дней с момента
                    наступления таких обстоятельств. Если форс-мажор длится
                    более трёх месяцев, каждая из Сторон вправе в одностороннем
                    порядке отказаться от Соглашения.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    11. Обмен информацией
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>11.1.</span> Стороны
                    признают надлежащими следующие средства коммуникации: со
                    стороны Агента — адрес электронной почты
                    support@zaneshop.ru; со стороны Принципала — адрес
                    электронной почты, Telegram или ВКонтакте, указанные при
                    регистрации в Сервисе.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>11.2.</span>{' '}
                    Документы, направляемые указанными средствами связи,
                    считаются подписанными простой электронной подписью и
                    равнозначны бумажным документам, подписанным
                    собственноручно.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    12. Разрешение споров
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>12.1.</span> Стороны
                    стремятся урегулировать все споры путём переговоров.
                    Претензия направляется через средства коммуникации,
                    указанные в разделе 11, и должна содержать суть требования и
                    подтверждающие доказательства.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>12.2.</span> Если в
                    течение 30 рабочих дней ответ не получен или соглашение не
                    достигнуто, спор передаётся на рассмотрение в суд по месту
                    нахождения Агента в соответствии с законодательством
                    Российской Федерации.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    13. Исключительные права
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>13.1.</span> Агент
                    является правообладателем Сервиса, включая программы для
                    ЭВМ, элементы дизайна и интерфейс. Агент вправе изменять,
                    дорабатывать и обновлять Сервис без предварительного
                    уведомления Принципала, а также проводить профилактические
                    работы, временно приостанавливающие работу Сервиса.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>13.2.</span> Принципал
                    не вправе требовать возмещения убытков за временное
                    прекращение доступа в связи с профилактическими работами.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    14. Персональные данные
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>14.1.</span> Совершая
                    акцепт настоящего Соглашения, Принципал даёт согласие на
                    обработку своих персональных данных в соответствии с
                    Политикой конфиденциальности: https://zaneshop.ru/privacy.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>14.2.</span> Обработка
                    персональных данных осуществляется в соответствии с
                    требованиями Федерального закона от 27.07.2006 №152-ФЗ «О
                    персональных данных».
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    15. Действие соглашения
                </h2>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>15.1.</span>{' '}
                    Соглашение вступает в силу с момента акцепта и действует до
                    исполнения Сторонами всех принятых обязательств или
                    одностороннего отказа одной из Сторон.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>15.2.</span> Агент
                    вправе в любое время в одностороннем порядке вносить
                    изменения в Соглашение путём публикации новой редакции на
                    Сервисе. Изменения вступают в силу с момента публикации.
                    Продолжая использовать Сервис после внесения изменений,
                    Принципал принимает условия новой редакции.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>15.3.</span> Если
                    какое-либо положение Соглашения окажется недействительным в
                    соответствии с законодательством РФ, остальные положения
                    сохраняют юридическую силу. К Соглашению применяется
                    законодательство Российской Федерации.
                </p>
            </div>

            <div className='user-agreement__section'>
                <h2 className='user-agreement__section-title'>
                    Реквизиты агента
                </h2>
                <p className='user-agreement__paragraph'>
                    ИП Рустамов Ибрагим Эльнурович
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>ИНН:</span>{' '}
                    500316223494
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>ОГРНИП:</span>{' '}
                    326508100270908
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>
                        Дата регистрации:
                    </span>{' '}
                    30 апреля 2026 г.
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>
                        Регистрирующий орган:
                    </span>{' '}
                    Межрайонная ИФНС России №23 по Московской области
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>Сайт:</span>{' '}
                    https://zaneshop.ru
                </p>
                <p className='user-agreement__paragraph'>
                    <span className='user-agreement__num'>
                        Электронная почта:
                    </span>{' '}
                    support@zaneshop.ru
                </p>
            </div>
        </div>
    );
}
