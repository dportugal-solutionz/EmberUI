module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      flex: {
        '75-75-0':'75 75 0%',
        '25-25-0':'25 25 0%',
        '75-1-0':'75 1 0%',
        '25-1-0':'25 1 0%'
      },
      colors:{
        'idle':'#A1C7E0',
        'pressed':'#026E81',
        'selected':'#FF9933',
        'muted':'#D50000',
        'poweron':'#41D500',
        'poweroff':'#D50000',
        'groupbox':'026E81',
        'text':'',
      },
      height: {
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
      }
    },
  },
  plugins: []
}
