
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
        {label: 'Transfer', icon: 'pi pi-send'},
        {label: 'Claim', icon: 'pi pi-download'},
        {label: 'History', icon: 'pi pi-history'}
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
        <div className="menu">
            <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => handleOnTabChangeRouting(e)} />
        </div>
    );
}

export default Menu;
