// =============== Libraries =============== //
import axios from "axios";

// =============== Const =============== //
import Address from "@/consts/address";

export default axios.create({
	baseURL: Address,
	timeout: 10000,
});
