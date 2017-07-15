// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  replace: true,
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    pagination: {
      type: Boolean,
      default: false
    },
    rowCountPerPage: {
      type: Number,
      default: 10
    }
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      // pagination related below
      currentPage: 1,
      pStartRowCount: 1,
      pEndRowCount: this.rowCountPerPage,  // initial only, will be updated when calculate the filteredData
      disabledPrev: true,
      disabledNext: false,  // initial only, will be updated when calculate the filteredData
      totalAfterFilter: 0   // initial only, will be updated when calculate the filteredData
    }
  },
  computed: {
    totalRowCount: function () {
      return this.data.length;
    },
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }

      this.totalAfterFilter = data.length;
      if(this.pagination) {

        var startP = (this.currentPage - 1) * this.rowCountPerPage;

        this.pStartRowCount = (data.length === 0) ? 0 : startP + 1;
        this.pEndRowCount = data.length - startP >= this.rowCountPerPage ? this.rowCountPerPage + startP : startP + data.length - startP;

        this.disabledPrev = (this.currentPage === 1);
        this.disabledNext = (data.length - this.pEndRowCount <= 0);

        return data.slice(startP, this.pEndRowCount);
      }

      return data
    }
  },
  watch: {
    totalRowCount: function () {
      this.currentPage = 1;
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    prev: function () {
      if(!this.disabledPrev) {
        this.currentPage -= 1;
      }
    },
    next: function () {
      if(!this.disabledNext) {
        this.currentPage += 1;
      }
    }
  }
})

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 },
      { name: 'Chuck Norris 1', power: Infinity },
      { name: 'Bruce Lee 1', power: 9000 },
      { name: 'Jackie Chan 1', power: 7000 },
      { name: 'Jet Li 1', power: 8000 },
      { name: 'Chuck Norris 2', power: Infinity },
      { name: 'Bruce Lee 2', power: 9000 },
      { name: 'Jackie Chan 2', power: 7000 },
      { name: 'Jet Li 2', power: 8000 },
      { name: 'Chuck Norris 3', power: Infinity },
      { name: 'Bruce Lee 3', power: 9000 },
      { name: 'Jackie Chan 3', power: 7000 },
      { name: 'Jet Li 3', power: 8000 },
      { name: 'Chuck Norris 4', power: Infinity },
      { name: 'Bruce Lee 4', power: 9000 },
      { name: 'Jackie Chan 4', power: 7000 },
      { name: 'Jet Li 4', power: 8000 },
      { name: 'Chuck Norris 5', power: Infinity },
      { name: 'Bruce Lee 5', power: 9000 },
      { name: 'Jackie Chan 5', power: 7000 },
      { name: 'Jet Li 5', power: 8000 }
    ]
  },
  methods: {
    insertData: function (position) {
      if(position == 'top') {
        this.gridData = [
          { name: 'Top top', power: Infinity }
        ].concat(this.gridData);
      } else if (position == 'bottom') {
        this.gridData = this.gridData.concat([
          { name: 'Bottom bottom', power: Infinity }
        ]);
      }
    }
  }
});

//demo.gridData = [{ name: 'Jet Li 5', power: 8000 }];