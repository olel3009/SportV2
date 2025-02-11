import 'datatables.net-dt/css/dataTables.dataTables.css';
import dynamic from 'next/dynamic';

export const DataTable = dynamic(
    async () => {
        const dtReact = import('datatables.net-react');
        const dtNet = import(`datatables.net-dt`);

        const [reactMod, dtNetMod] = await Promise.all([dtReact, dtNet]);

        reactMod.default.use(dtNetMod.default);
        return reactMod.default;
    },
    { ssr: false }
)