const { Event } = require("../../models");
const Joi = require("joi");

const URL = "http://localhost:4000/uploads/";

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const mainString = JSON.stringify(events);
    const mainObject = JSON.parse(mainString);

    const withImage = {
      ...mainObject,
      image: `${URL}${mainObject?.image}`,
    };

    res.send({
      status: "SUCCESS",
      message: "GET All Events Successful",
      events: events,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

exports.getOneEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({
      where: {
        id: id,
      },
    });
    res.send({
      status: "SUCCESS",
      message: "GET One Event Successful",
      event: event,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, location, date, participant, note, image } = req.body;

    const schema = Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      date: Joi.string().required(),
      participant: Joi.string().required(),
      note: Joi.string().min(50).required(),
      image: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({
        status: "Form Error",
        message: error.details[0].message,
      });

    const newEvent = await Event.create({
      title,
      location,
      date,
      participant,
      note,
      image: `${URL}${req.files.image[0].filename}`,
    });
    // 2021-05-30 09:00:00

    const event = await Event.findOne({
      where: {
        id: newEvent.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      message: "ADD Event Successfull",
      event,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await Event.findOne({
      where: {
        id: id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Not Found",
        message: `Product with id: ${id} not found`,
      });

    await Event.destroy({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "DELETE Event Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
