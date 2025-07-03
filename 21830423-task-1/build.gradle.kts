plugins {
    kotlin("jvm") version "2.2.0"
    application
}

group = "dev.bluesion.mnservice.task1"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("dev.bluesion.mnservice.task1.MainKt")
}