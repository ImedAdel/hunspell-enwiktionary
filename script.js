const fs = require("fs")
const readline = require("readline")

const path = "words.dic"

try {
	fs.unlinkSync(path)
	//file removed
} catch (err) {
	console.error(err)
}

const stream = fs.createWriteStream("words.dic", { flags: "a" })

var rd = readline.createInterface({
	input: fs.createReadStream("./en-dump.json"),
	// output: process.stdout,
	// console: false,
})

const wrds = new Set()

console.log(new Date().toISOString())
rd.on("line", function (line) {
	const parsed = JSON.parse(line)
	if (
		[
			"affix",
			"prefix",
			"suffix",
			"circumfix",
			"infix",
			"interfix",
			"phrase",
			"adv_phrase",
			"punct",
		].includes(parsed.pos)
	) {
		return
	}

	if (Array.isArray(parsed.forms)) {
		for (const { form } of parsed.forms) {
			wrds.add(form)
		}
	}
})

rd.on("close", () => {
	console.log(new Date().toISOString())
	stream.write(wrds.size + "\n")

	console.log(new Date().toISOString())
	for (const wrd of wrds) {
		stream.write(wrd + "\n")
	}

	console.log(new Date().toISOString())
	stream.end()
})
