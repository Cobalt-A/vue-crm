<template>
  <div class="col s12 m12 l8">
    <div class="card teal">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{'courseCurrency' | localize}}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{'currency' | localize}}</th>
              <th>{{'course' | localize}}</th>
              <th>{{'date' | localize}}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur in currencies" :key="cur">
              <td>{{cur}}</td>
              <td>{{rates[cur]}}</td>
              <td>{{date | date('date')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
export default {
	props: ['rates', 'date'],
	data: () => ({
		currencies: ['RUB', 'USD', 'EUR']
	})
}
</script>
