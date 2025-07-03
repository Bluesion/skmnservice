package dev.bluesion.mnservice.task1

import dev.bluesion.mnservice.task1.data.FileParser
import java.io.InputStream

fun main() {
    val fileParser = FileParser()

    val osmInputStream = readResourceFile("roads.osm")
    if (osmInputStream == null) {
        return
    }

    val osmData = fileParser.parseOsm(osmInputStream)

    val gpsFileNames = listOf(
        "gps_left_turn.csv",
        "gps_multipath.csv",
        "gps_left02_turn.csv",
        "gps_reverse_direction.csv",
        "gps_right02_turn.csv",
        "gps_straight01.csv",
        "gps_right_turn_01.csv",
        "gps_straight04.csv",
        "gps_straight02.csv",
        "gps_straight03.csv"
    )

    for (gpsFileName in gpsFileNames) {
        val gpsData = fileParser.parseCsv(gpsFileName)
        if (gpsData.isEmpty()) {
            println("$gpsFileName 오류: GPS 데이터 검출 안 됨")
            continue
        }
    }
}

fun readResourceFile(fileName: String): InputStream? {
    val inputStream: InputStream? = try {
        object {}.javaClass.classLoader.getResourceAsStream(fileName)
    } catch (e: Exception) {
        println("리소스 불러오기 오류: ${e.message}")
        null
    }

    return inputStream
}
