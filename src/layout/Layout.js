
import MainNavigation from "./MainNavigation"
import Footer from "./Footer";

function Layout(props) {
    return (
        <div className="layoutContainer">
            <MainNavigation />
            <div className="wrapper">
                <main className={""}>{props.children}</main>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default Layout;