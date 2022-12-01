
import Link from "next/link";

type Menu = {
    page: string;
};

const Menu = ({page}: Menu) => {
    return (
        <div>
            <h1>{page}</h1>
            <div>
                <Link href="/"><a>Transfer</a></Link> {" | "}
                <Link href="/claim"><a>Claim</a></Link> {" | "}
                <Link href="/history"><a>TxHistory</a></Link>
            </div>
        </div>
    );
}

export default Menu;
