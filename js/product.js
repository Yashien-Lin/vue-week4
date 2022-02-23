import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";
import pagination from "./pagination.js";

let productModal;
let delProductModal;

const app = createApp({
  components: {
    pagination,
  },
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yashienxzxz",
      isNew: "",
      products: [],
      temp: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  methods: {
    checkLogin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },
    getData(page = 1) {
      //預設值=1
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => console.log(err.data.message));
    },
    openModal(status, item) {
      if (status == "new") {
        this.temp = {
          imagesUrl: [],
        };
        productModal.show();
        this.isNew = true;
      } else if (status == "edit") {
        this.temp = JSON.parse(JSON.stringify(item)); //深拷貝避免多圖傳參考問題
        productModal.show();
        this.isNew = false;
      } else if (status == "delete") {
        this.temp = { ...item };
        delProductModal.show();
      }
    },
  },
  mounted() {
    //取出token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    //存進header
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();

    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      { keyboard: false }
    );

    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      { keyboard: false }
    );
  },
});

//Modal彈出視窗元件(新增/編輯產品)
app.component("productModal", {
  template: "#templateForProductModal",
  props: ["temp", "isNew"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yashienxzxz",
    };
  },
  methods: {
    updateProducts() {
      //預設狀態為新增商品
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = "post";
      console.log(this.isNew);

      //若不是新產品，則編輯產品put
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`;
        httpMethod = "put";
      }

      axios[httpMethod](url, { data: this.temp })
        .then((res) => {
          this.$emit("get-products");
          productModal.hide();
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data);
        });
    },
    createImages() {
      this.temp.imagesUrl = [];
      this.temp.imagesUrl.push("");
    },
  },
  mouted() {
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      { keyboard: false }
    );
  },
});

//Modal彈出視窗元件(刪除產品)
app.component("deleteModal", {
  template: "#templateForDeleteModal",
  props: ["temp"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yashienxzxz",
    };
  },
  methods: {
    delProduct() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`
        )
        .then((res) => {
          this.$emit("get-products");
          delProductModal.hide();
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data);
        });
    },
  },
});

app.mount("#app");
