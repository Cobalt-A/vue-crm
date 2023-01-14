<template>
  <table>
    <thead>
    <tr>
      <th>№</th>
      <th>{{'amount' | localize}}</th>
      <th>{{'date' | localize}}</th>
      <th>{{'category' | localize}}</th>
      <th>{{'type' | localize}}</th>
      <th>{{'toOpen' | localize}}</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(record, idx) of records" :key="record.id">
      <td>{{idx + 1}}</td>
      <td>{{record.amount | currency}}</td>
      <td>{{record.date | date('datetime')}}</td>
      <td>{{record.categoryName}}</td>
      <td>
        <span
          :class="[record.typeClass]"
          class="white-text badge"
        >{{record.typeText}}</span>
      </td>
      <td>
        <button class="btn-small btn" @click="$router.push('/detail-record/' + record.id)">
          <i class="material-icons">open_in_new</i>
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>


<script>
export default {
  props: {
    records: {
      required: true,
      type: Array
    }
  }
}
</script>

