import axios from "axios";

export const fetchIsNewsLiked = async (userId,newsId) =>{
    try{
        const { data } = await axios.get(`https://localhost:8080/likes/${userId}/${newsId}`);
        return data.liked;
    }catch(error){
        console.error("fetchIsNewsLiked():", error);
        return { isLiked: false, likeId: null };
    }
};

export const fetchCreateLike = async (userId,newsId) =>{
    try{
        const body = { userId, newsId };
        const { data } = await axios.post(`https://localhost:8080/likes`, body);
        return data;
    }catch(error){
        console.error("fetchCreateLike():", error);
        throw error;
    }
};

export const fetchDeleteLike = async (userId,newsId) =>{
    try{
         const { data } = await axios.delete(`https://localhost:8080/likes/${userId}/${newsId}`);
         return data.success;
    }catch(error){
        console.error("fetchIsNewsLiked:", error);
        return false;
    }
};