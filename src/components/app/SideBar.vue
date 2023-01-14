<template>
  <ul class="sidenav app-sidenav" :class="{open: value}">

    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-teal pointer">{{link.title}}</a>
    </router-link>

  </ul>
</template>


<script>
import localizeFilter from '@/filters/localize.filter'

export default {
  props: ['value'],
  data: () => ({
    links: [
      {title: localizeFilter('bill'), url: '/', exact:  true},
      {title: localizeFilter('history'), url: '/history'},
      {title: localizeFilter('planing'), url: '/planing'},
      {title: localizeFilter('newRecord'), url: '/record'},
      {title: localizeFilter('categories'), url: '/categories'}
    ]
  })
}
</script>
