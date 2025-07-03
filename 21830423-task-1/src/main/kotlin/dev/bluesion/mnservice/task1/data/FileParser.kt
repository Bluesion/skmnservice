package dev.bluesion.mnservice.task1.data

import dev.bluesion.mnservice.task1.data.model.*
import org.w3c.dom.Document
import org.w3c.dom.Element
import org.w3c.dom.NodeList
import java.io.InputStream
import javax.xml.parsers.DocumentBuilderFactory

/**
 * OSM과 CSV 파일을 파싱하는 클래스입니다.
 */
class FileParser {

    /**
     * OSM(OpenStreetMap) XML 파일을 파싱하여 [Osm] 객체로 변환합니다.
     *
     * @param inputStream 파싱할 OSM XML 파일의 [InputStream]
     * @return 파싱된 [Osm] 객체
     */
    fun parseOsm(inputStream: InputStream): Osm {
        val factory = DocumentBuilderFactory.newInstance()
        val builder = factory.newDocumentBuilder()
        val document: Document = builder.parse(inputStream)
        document.documentElement.normalize() // Normalize text nodes

        val osm = Osm()

        // Node 파싱
        val nodeElements: NodeList = document.getElementsByTagName("node")
        for (i in 0 until nodeElements.length) {
            val nodeElement = nodeElements.item(i) as Element
            val node = Node(
                id = nodeElement.getAttribute("id").toLong(),
                lat = nodeElement.getAttribute("lat").toDouble(),
                lon = nodeElement.getAttribute("lon").toDouble()
            )
            osm.nodes.add(node)
        }

        // Way 파싱
        val wayElements: NodeList = document.getElementsByTagName("way")
        for (i in 0 until wayElements.length) {
            val wayElement = wayElements.item(i) as Element
            val way = Way(wayElement.getAttribute("id").toLong())
            val nds = wayElement.getElementsByTagName("nd")
            for (j in 0 until nds.length) {
                val ndElement = nds.item(j) as Element
                val node = osm.nodes.find {
                    it.id == ndElement.getAttribute("ref").toLong()
                }

                if (node != null) {
                    way.nodes.add(node)
                }
            }
            val tags = wayElement.getElementsByTagName("tag")
            for (j in 0 until tags.length) {
                val tagElement = tags.item(j) as Element
                way.tags[tagElement.getAttribute("k") ?: ""] = tagElement.getAttribute("v") ?: ""
            }
            osm.ways.add(way)
        }

        return osm
    }

    /**
     * CSV 파일을 파싱하여 [GpsPoint] 객체 리스트로 변환합니다.
     *
     * @param fileName 파싱할 CSV 파일의 이름
     * @return 파싱된 [GpsPoint] 객체 리스트
     */
    fun parseCsv(fileName: String): List<GpsPoint> {
        val gpsData = mutableListOf<GpsPoint>()
        try {
            val lines = object {}.javaClass.getResourceAsStream("/$fileName")?.bufferedReader()?.readLines()
            if (lines == null || lines.size <= 1) {
                println("에러: ${fileName}은 헤더를 포함하여 2줄 미만입니다.")
                return emptyList()
            }

            // 헤더 건너뛰기
            for (line in lines.drop(1)) {
                val parts = line.split(",")
                if (parts.size == 5) {
                    try {
                        val latitude = parts[0].toDouble()
                        val longitude = parts[1].toDouble()
                        val angle = parts[2].toDouble()
                        val speedKmh = parts[3].toDouble()
                        val hdop = parts[4].toDouble()
                        gpsData.add(GpsPoint(latitude, longitude, angle, speedKmh, hdop))
                    } catch (e: NumberFormatException) {
                        println("[$fileName:$line] 파싱 오류: ${e.message}")
                    }
                } else {
                    println("[$fileName: $line] column 개수 오류: 파싱을 건너뜁니다.")
                }
            }
        } catch (e: Exception) {
            println("$fileName 파싱 오류: ${e.message}")
        }

        return gpsData
    }
}