const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/car-haul', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const Car = mongoose.model('Car', new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  price: Number,
  seller: String,
  status: String,
}));

const Loan = mongoose.model('Loan', new mongoose.Schema({
  carId: String,
  buyer: String,
  banker: String,
  amount: Number,
  status: String,
}));

const Offer = mongoose.model('Offer', new mongoose.Schema({
  carId: String,
  buyer: String,
  seller: String,
  amount: Number,
  status: String,
}));

const Delivery = mongoose.model('Delivery', new mongoose.Schema({
  carId: String,
  hauler: String,
  destination: String,
  status: String,
}));

const Policy = mongoose.model('Policy', new mongoose.Schema({
  carId: String,
  buyer: String,
  insurer: String,
  amount: Number,
  status: String,
}));

const Dispute = mongoose.model('Dispute', new mongoose.Schema({
  parties: [String],
  description: String,
  status: String,
}));

const seedData = async () => {
  await Car.deleteMany({});
  await Loan.deleteMany({});
  await Offer.deleteMany({});
  await Delivery.deleteMany({});
  await Policy.deleteMany({});
  await Dispute.deleteMany({});

  const car = await new Car({
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 25000,
    seller: 'Seller1',
    status: 'Available',
  }).save();

  await new Loan({
    carId: car._id,
    buyer: 'Buyer1',
    banker: 'Banker1',
    amount: 20000,
    status: 'Pending',
  }).save();

  await new Offer({
    carId: car._id,
    buyer: 'Buyer1',
    seller: 'Seller1',
    amount: 23000,
    status: 'Pending',
  }).save();

  await new Delivery({
    carId: car._id,
    hauler: 'Hauler1',
    destination: 'Los Angeles',
    status: 'In Transit',
  }).save();

  await new Policy({
    carId: car._id,
    buyer: 'Buyer1',
    insurer: 'Insurer1',
    amount: 500,
    status: 'Active',
  }).save();

  await new Dispute({
    parties: ['Seller1', 'Buyer1', 'FreightTrust1'],
    description: 'Dispute over car condition',
    status: 'Open',
  }).save();

  console.log('Database seeded!');
  mongoose.connection.close();
};

seedData();