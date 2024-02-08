import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class MediaService {
  static downloadFile(filePath: string) {
    const url = `${baseURL}/charity/file/download/?file_path=${filePath}`;
    let filePathArr = filePath.split('/');
    let fileName = filePathArr[filePathArr.length - 1];

    axios.get(url, {responseType: 'blob'}).then((response) => {
      let fileURL = window.URL.createObjectURL(new Blob([response.data]));
      let fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
    });
  }
}

export default MediaService;
