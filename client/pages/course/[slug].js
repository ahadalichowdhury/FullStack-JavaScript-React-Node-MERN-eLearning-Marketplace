import {useState, useEffect, useContext} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourse from "@/components/cards/SingleCourse";
import PreviewModal from "@/components/modal/PreviewModal";
import SingleCourseLessons from "@/components/cards/SingleCourseLessons";
import {Context} from "@/context";
import {toast} from "react-toastify";
import {loadStripe} from "@stripe/stripe-js";


const singleCourse = ({course}) => {
    //state
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState({});

    //context
    const {state: {user}} = useContext(Context)

    useEffect(()=>{
        if(user && course){
            checkUserEnrollment();
        }
    }, [user, course])

    const checkUserEnrollment = async () => {
        const {data} = await axios.get(`/api/v1/check-enrollment/${course._id}`);
        console.log("user enrollment =>", data);
        setEnrolled(data);
    }

    const router = useRouter();
    const {slug} = router.query;

    const handlePaidEnrollment = async () => {
        // console.log("handle paid enrollment");
        try{
            setLoading(true);

            if (!user) {
                router.push('/login');
                return;
            }

            // check if user has already enrolled
            if (enrolled.status) {
                router.push(`/user/course/${enrolled.course.slug}`);
                return;
            }

            const { data } = await axios.post(`/api/v1/paid-enrollment/${course._id}`);
            console.log('paid enrollment =>', data);

            // load stripe checkout
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
            // console.log(data.sessionId);

            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

            if (error) {
                toast('Enrollment failed. Try again later');
                console.log(error);
                setLoading(false);
                return;
            }

        }catch (e) {
            toast("Enrollment failed. Try again later");
            console.log(e);
            setLoading(false)
        }
    }
    const handleFreeEnrollment = async (e) => {
        // console.log("handle free enrollment");
        e.preventDefault()
        try{
            //check if user is logged in
            if(!user){
                router.push("/login")
            }
            //check if user has already enrolled
            if(enrolled.status){
                return router.push(`/user/course/${enrolled.course.slug}`);
            }
            setLoading(true)
            const {data} = await axios.post(`/api/v1/free-enrollment/${course._id}`);
            // console.log("free enrollment =>", data);
            toast(data.message);
            setLoading(false)
            router.push(`/user/course/${enrolled.course.slug}`);
        }catch (e) {
            toast("Enrollment failed. Try again");
            console.log(e)
            setLoading(false)
        }
    }

    return (
        <>
            <SingleCourse
                course={course}
                setShowModal={setShowModal}
                showModal={showModal}
                setPreview={setPreview}
                preview={preview}
                loading={loading}
                handlePaidEnrollment={handlePaidEnrollment}
                handleFreeEnrollment={handleFreeEnrollment}
                user={user}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
            />
            <PreviewModal
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
            />
            {course.lessions && (
                <SingleCourseLessons
                    lessions={course.lessions}
                    setPreview={setPreview}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </>
    )
}

export async function getServerSideProps ({query}){
    const {data} = await axios.get(`http://localhost:8000/api/v1/course/${query.slug}`);
    return {
        props: {
            course: data
        }
    }
}
export default singleCourse;