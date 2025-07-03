package dev.bluesion.mnservice.task1.data

import kotlin.math.*

/**
 * Haversine 공식을 위한 유틸리티 함수를 제공합니다.
 */
object Haversine {

    /**
     * 지구의 반지름(킬로미터)입니다. 지구는 완벽한 구형이 아니므로 평균 반지름입니다.
     */
    private const val EARTH_RADIUS_KM = 6371.0

    /**
     * Haversine 공식을 사용하여 두 지리적 지점(위도 및 경도) 사이의 거리를 계산합니다.
     *
     * @param lat1 첫 번째 지점의 위도
     * @param lon1 첫 번째 지점의 경도
     * @param lat2 두 번째 지점의 위도
     * @param lon2 두 번째 지점의 경도
     * @return 두 지점 사이의 거리(km)
     */
    fun distance(
        lat1: Double,
        lon1: Double,
        lat2: Double,
        lon2: Double
    ): Double {
        // 위도와 경도를 도에서 라디안으로 변환
        val lat1Rad = Math.toRadians(lat1)
        val lon1Rad = Math.toRadians(lon1)
        val lat2Rad = Math.toRadians(lat2)
        val lon2Rad = Math.toRadians(lon2)

        // Haversine 공식 구성 요소
        val dLat = lat2Rad - lat1Rad
        val dLon = lon2Rad - lon1Rad

        // 두 지점 사이 중심각의 절반 제곱
        val a = sin(dLat / 2).pow(2) + cos(lat1Rad) * cos(lat2Rad) * sin(dLon / 2).pow(2)

        // 라디안 단위의 각도 거리
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return EARTH_RADIUS_KM * c
    }
}
