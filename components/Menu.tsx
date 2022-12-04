
import Link from "next/link";
import { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { useRouter } from "next/router";

type Menu = {
    index: number;
};

const Menu = ({index}: Menu) => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(index);

    const items = [
        {label: 'Home', icon: 'pi pi-fw pi-home'},
        {label: 'Transfer', icon: 'pi pi-fw pi-calendar'},
        {label: 'Claim', icon: 'pi pi-fw pi-pencil'},
        {label: 'History', icon: 'pi pi-fw pi-file'}
    ];

    const handleOnTabChangeRouting = (event: any) => {
        setActiveIndex(event.index);
        switch (event.index) {
            case 0:
                return router.push("/");
            case 1:
                return router.push("/transfer");
            case 2:
                return router.push("/claim");
            case 3:
                return router.push("/history");
        }
    }

    return (
        <div>
            <div className="card">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => handleOnTabChangeRouting(e)} />
            </div>
            {/* <div>
                <Link href="/"><a>Home</a></Link> {" | "}
                <Link href="/transfer"><a>Transfer</a></Link> {" | "}
                <Link href="/claim"><a>Claim</a></Link> {" | "}
                <Link href="/history"><a>TxHistory</a></Link>
            </div> */}
        </div>
    );
}

export default Menu;
