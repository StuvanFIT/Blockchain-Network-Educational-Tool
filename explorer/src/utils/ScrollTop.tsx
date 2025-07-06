import { useEffect } from "react";
import { useLocation } from "react-router";



const ScrollToTop = () => {

    const location = useLocation();

    useEffect(() => {
        const element = document.documentElement || document.body;
        console.log(element)
        element.scrollTop = 0;
    }, [location]);


    return null;
}

export default ScrollToTop