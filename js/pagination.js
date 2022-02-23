export default {
  props: ["pages"],
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent = "$emit('get-product', page-1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" 
          :class="{ active: page === pages.current_page }" 
          v-for="(page,id) in pages.total_pages" :key="id">
        <a class="page-link" @click.prevent="$emit('get-product', page)" href="#">{{page}}</a>    <!-- 向外傳遞事件-->
      </li>
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent = "$emit('get-product', page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
};
