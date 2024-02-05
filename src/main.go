package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/gofiber/fiber/v2"
)

// Path to the JSON file
const jsonFilePath = "ml/data.json"

func main() {
	app := fiber.New()

	app.Post("/learn", handleLearnEndpoint)
	app.Post("/get_data", handleGetDataEndpoint)

	fmt.Println("Server listening on :8080")
	err := app.Listen(":8080")
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}

func handleGetDataEndpoint(c *fiber.Ctx) error {
    jsonFile, err := ioutil.ReadFile(jsonFilePath)

	if err!= nil {
        return c.Status(500).SendString(err.Error())
    }

    return c.SendString(string(jsonFile))
}

func handleLearnEndpoint(c *fiber.Ctx) error {
	existingData := readDataFromFile()

	var newData [2]string
	if err := c.BodyParser(&newData); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error decoding JSON")
	}

	existingData = append(existingData, newData)

	writeDataToFile(existingData)
	return c.SendString("Data appended successfully")
}

// Function to read data from the JSON file
func readDataFromFile() [][2]string {
	file, err := ioutil.ReadFile(jsonFilePath)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return [][2]string{}
	}

	var data [][2]string
	err = json.Unmarshal(file, &data)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return [][2]string{}
	}

	return data
}

func writeDataToFile(data [][2]string) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}

	err = ioutil.WriteFile(jsonFilePath, jsonData, 0644)
	if err != nil {
		fmt.Println("Error writing to file:", err)
	}
}
