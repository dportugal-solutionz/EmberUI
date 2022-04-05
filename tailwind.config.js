module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors:{
        idle:'#E1E1E1',
        pressed:'#9DAECF',
        selected:'#0055FF',
        muted:'#D50000',
        poweron:'#41D500',
        poweroff:'#D50000'
      },
      height: theme=> ({
        '10vh':'10vh',
        '20vh':'20vh',
        '30vh':'30vh',
        '40vh':'40vh',
        '50vh':'50vh',
        '60vh':'60vh',
        '70vh':'70vh',
        '80vh':'80vh',
        '90vh':'90vh',
        '25vh':'25vh',
        '75vh':'75vh',
      })
    },
  },
  plugins: []
}
